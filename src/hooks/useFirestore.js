import { useState, useEffect } from 'react';
import { db } from '../utils/firebase';
import {
    collection, query, where, onSnapshot,
    addDoc, deleteDoc, doc, updateDoc
} from 'firebase/firestore';

export const useFirestore = (collectionName, userId) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) {
            setData([]);
            setLoading(false);
            return;
        }

        const q = userId
            ? query(collection(db, collectionName), where("userId", "==", userId))
            : collection(db, collectionName);

        const unsubscribe = onSnapshot(q, (snapshot) => {
            setData(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        }, (err) => {
            console.error(`Firestore Error (${collectionName}):`, err);
            setLoading(false);
        });

        return unsubscribe;
    }, [collectionName, userId]);

    const add = async (item) => {
        return await addDoc(collection(db, collectionName), { ...item, userId });
    };

    const remove = async (id) => {
        return await deleteDoc(doc(db, collectionName, id));
    };

    const update = async (id, updates) => {
        return await updateDoc(doc(db, collectionName, id), updates);
    };

    return { data, loading, add, remove, update };
};
