"use client";
import { setUser } from "@/features/auth/lib/redux/slices/userSlice";
import { User } from "@/features/auth/utils/types";
import { useAppDispatch } from "@/lib/redux/hooks";
import { useEffect } from "react";

const InitializeUserData = ({ user }: { user?: User }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setUser(user));
  }, [dispatch, user]);

  return null;
};

export default InitializeUserData;
