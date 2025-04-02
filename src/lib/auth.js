import bcrypt from "bcryptjs";
import { supabase } from "./supabase";

//Function to handle email/password registration
export async function registerUser(email, password, name) {
  try {
    //hashing the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //create the user in supabase auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    //add the user to the profile table
    const { error: profileError } = await supabase
      .from("profiles")
      .insert([{ id: data.user.id, email, name }]);

    if (profileError) throw profileError;

    return { success: true, user: data.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

//function to handle email/password login
export async function loginUser(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return { success: true, user: data.user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

//function to get user profiles
export async function getUserProfile(userId) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;

    return { success: true, profile: data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
