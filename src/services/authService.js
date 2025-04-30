// src/services/authService.js
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { setDoc, doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export const signUpWithEmail = async (email, password, userData) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, {
      displayName: `${userData.firstName} ${userData.lastName}`
    });

    await setDoc(doc(db, "users", user.uid), {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: email,
      phoneNumber: userData.phoneNumber || "",
      dob: userData.dob || "",
      signupMethod: "email",
      role: "user",
      points: 0,
      eventsAttended: 0,
      createdAt: new Date()
    });

    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const checkAdminRole = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return { success: true, isAdmin: userData.role === "admin" };
    }
    return { success: false, isAdmin: false };
  } catch (error) {
    return { success: false, isAdmin: false, error: error.message };
  }
};

export const updateUserRole = async (userId, newRole) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { role: newRole });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const loginWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    const names = user.displayName ? user.displayName.split(" ") : ["Google", "User"];
    const firstName = names[0];
    const lastName = names.length > 1 ? names.slice(1).join(" ") : "";

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        firstName,
        lastName,
        email: user.email,
        phoneNumber: user.phoneNumber || "",
        dob: "",
        signupMethod: "google",
        role: "user",
        points: 0,
        eventsAttended: 0,
        createdAt: new Date()
      });
    } else {
      const data = userSnap.data();
      await updateDoc(userRef, {
        firstName: data.firstName ?? firstName,
        lastName: data.lastName ?? lastName,
        points: data.points ?? 0,
        eventsAttended: data.eventsAttended ?? 0,
      });
    }

    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const loginWithFacebook = async () => {
  try {
    const provider = new FacebookAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    const names = user.displayName ? user.displayName.split(" ") : ["Facebook", "User"];
    const firstName = names[0];
    const lastName = names.length > 1 ? names.slice(1).join(" ") : "";

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        firstName,
        lastName,
        email: user.email,
        phoneNumber: user.phoneNumber || "",
        dob: "",
        signupMethod: "facebook",
        role: "user",
        points: 0,
        eventsAttended: 0,
        createdAt: new Date()
      });
    } else {
      const data = userSnap.data();
      await updateDoc(userRef, {
        firstName: data.firstName ?? firstName,
        lastName: data.lastName ?? lastName,
        points: data.points ?? 0,
        eventsAttended: data.eventsAttended ?? 0,
      });
    }

    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getCurrentUserData = async (userId) => {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { success: true, userData: docSnap.data() };
    } else {
      return { success: false, error: "User data not found" };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateUserData = async (userId, userData) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, userData);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteUser = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    await deleteDoc(userRef);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
