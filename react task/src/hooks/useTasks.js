import { useEffect, useState, useCallback } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';

const toIso = (ts) => (ts?.toDate ? ts.toDate().toISOString() : ts ?? null);

const mapDoc = (d) => {
  const data = d.data();
  return {
    id: d.id,
    title: data.title ?? '',
    description: data.description ?? '',
    category: data.category ?? 'Personal',
    priority: data.priority ?? 'Medium',
    dueDate: data.dueDate ?? '',
    completed: !!data.completed,
    createdAt: toIso(data.createdAt) ?? new Date().toISOString(),
    updatedAt: toIso(data.updatedAt) ?? new Date().toISOString(),
  };
};

export default function useTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, 'tasks'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        setTasks(snap.docs.map(mapDoc));
        setLoading(false);
      },
      (err) => {
        console.error('Firestore listener error:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [user]);

  const addTask = useCallback(
    async (input) => {
      if (!user) throw new Error('Not signed in');
      const ref = await addDoc(collection(db, 'tasks'), {
        userId: user.uid,
        title: input.title,
        description: input.description || '',
        category: input.category || 'Personal',
        priority: input.priority || 'Medium',
        dueDate: input.dueDate || null,
        completed: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return ref.id;
    },
    [user]
  );

  const updateTask = useCallback(async (id, patch) => {
    const ref = doc(db, 'tasks', id);
    const clean = { ...patch, updatedAt: serverTimestamp() };
    if ('dueDate' in clean && !clean.dueDate) clean.dueDate = null;
    await updateDoc(ref, clean);
  }, []);

  const deleteTask = useCallback(async (id) => {
    await deleteDoc(doc(db, 'tasks', id));
  }, []);

  const toggleTask = useCallback(
    async (id) => {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;
      await updateTask(id, { completed: !task.completed });
    },
    [tasks, updateTask]
  );

  return { tasks, loading, error, addTask, updateTask, deleteTask, toggleTask };
}