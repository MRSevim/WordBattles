"use client";
import Container from "@/components/Container";
import ErrorMessage from "@/components/ErrorMessage";
import { Modal } from "@/components/Modal";
import { deleteUser } from "../utils/apiCallsClient";
import { useActionState, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { selectUser } from "../lib/redux/selectors";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { setUser } from "../lib/redux/slices/userSlice";
import { routeStrings } from "@/utils/routeStrings";
import UserLink from "@/components/UserLink";
import { useDictionaryContext } from "@/features/language/utils/DictionaryContext";

const Profile = () => {
  const [open, setOpen] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const user = useAppSelector(selectUser);
  const userImage = user?.image;
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { dictionary, locale } = useDictionaryContext();

  const [error, action, isPending] = useActionState(async () => {
    const text = dictionary.auth.profile.confirmText;
    if (confirmation !== text) return dictionary.auth.profile.confirmPrompt;

    const { error } = await deleteUser();
    if (!error) {
      setOpen(false);
      setConfirmation("");
      dispatch(setUser(undefined));
      router.push(routeStrings.home);
    }
    return error;
  }, "");

  if (!user) return null;

  return (
    <Container className="py-20 flex flex-col justify-start items-center gap-6">
      {/* User Image */}
      {userImage && (
        <div className="relative">
          <Image
            src={userImage}
            alt={dictionary.avatar}
            width={96}
            height={96}
            className="rounded-full object-cover ring-4 ring-gray-200 dark:ring-gray-700 shadow-md hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      {/* Public Profile Link */}
      <UserLink
        locale={locale}
        id={user.id}
        className="text-blue-600 dark:text-blue-400 font-medium underline-offset-4 hover:underline hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
      >
        {dictionary.auth.profile.seePublicPage}
      </UserLink>

      {/* Delete Button */}
      <button
        onClick={() => setOpen(true)}
        className="cursor-pointer flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-2.5 px-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 active:scale-95"
      >
        <i className="bi bi-trash text-lg"></i>
        {dictionary.auth.profile.confirmButton}
      </button>

      {/* Modal */}
      {open && (
        <Modal>
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6 mb-20">
            <h2 className="text-lg font-semibold text-red-600 mb-2">
              {dictionary.auth.profile.confirmDeletion}
            </h2>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              {dictionary.auth.profile.deleteP1}{" "}
              <span className="font-semibold">
                {dictionary.auth.profile.confirmText}
              </span>{" "}
              {dictionary.auth.profile.deleteP2} <br />
              {dictionary.auth.profile.deleteP3}
            </p>

            <form action={action}>
              <input
                type="text"
                value={confirmation}
                onChange={(e) => setConfirmation(e.target.value)}
                placeholder={dictionary.auth.profile.confirmText}
                className="w-full border border-gray-300 bg-primary-foreground rounded-md px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              />

              {error && <ErrorMessage error={error} />}

              <div className="flex justify-end gap-2 mt-5">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100 transition cursor-pointer"
                >
                  {dictionary.cancel}
                </button>
                <button
                  type="submit"
                  disabled={
                    confirmation !== dictionary.auth.profile.confirmText ||
                    isPending
                  }
                  className={`px-4 py-2 rounded-md text-white font-medium transition bg-red-600 hover:bg-red-700 cursor-pointer disabled:bg-red-400 disabled:cursor-not-allowed`}
                >
                  {isPending
                    ? dictionary.auth.profile.deleting
                    : dictionary.auth.profile.confirmDelete}
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </Container>
  );
};

export default Profile;
