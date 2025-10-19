"use client";
import { setUser } from "@/features/auth/lib/redux/slices/userSlice";
import { User } from "@/features/auth/utils/types";
import { useAppDispatch } from "@/lib/redux/hooks";
import { use, useEffect } from "react";

const UserInitializer = ({ userPromise }: { userPromise: Promise<User> }) => {
  const user = use(userPromise);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setUser(user));
  }, [dispatch, user]);
  return null;
};

export default UserInitializer;
