import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export async function getUserStats(userId) {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data();
    } else {
      console.log("No such user!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return null;
  }
}