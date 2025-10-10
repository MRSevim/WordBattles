"use client";
import { setUser } from "@/features/auth/lib/redux/slices/userSlice";
import { User } from "@/features/auth/utils/types";
import { useAppDispatch } from "@/lib/redux/hooks";
import { useEffect } from "react";

const InitializeData = ({ user }: { user: User }) => {
  const dispatch = useAppDispatch();

  dispatch(setUser(user));

  return null;
};

export default InitializeData;
