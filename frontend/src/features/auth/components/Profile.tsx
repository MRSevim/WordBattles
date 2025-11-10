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
import { useLocaleContext } from "@/features/language/helpers/LocaleContext";
import { t } from "@/features/language/lib/i18n";
import UserLink from "@/components/UserLink";

const Profile = () => {
  const [open, setOpen] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const user = useAppSelector(selectUser);
  const userImage = user?.image;
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [locale] = useLocaleContext();

  const [error, action, isPending] = useActionState(async () => {
    const text = t(locale, "auth.profile.confirmText");
    if (confirmation !== text) return t(locale, "auth.profile.confirmPrompt");

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
    <Container className="py-10 flex flex-col justify-center items-center gap-6">
      {/* User Image */}
      {userImage && (
        <div className="relative">
          <Image
            src={userImage}
            alt={t(locale, "avatar")}
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
        {t(locale, "auth.profile.seePublicPage")}
      </UserLink>

      {/* Delete Button */}
      <button
        onClick={() => setOpen(true)}
        className="cursor-pointer flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-2.5 px-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 active:scale-95"
      >
        <i className="bi bi-trash text-lg"></i>
        {t(locale, "auth.profile.confirmButton")}
      </button>

      {/* Modal */}
      {open && (
        <Modal>
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6 mb-20">
            <h2 className="text-lg font-semibold text-red-600 mb-2">
              {t(locale, "auth.profile.confirmDeletion")}
            </h2>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              {t(locale, "auth.profile.deleteP1")}{" "}
              <span className="font-semibold">
                {t(locale, "auth.profile.confirmText")}
              </span>{" "}
              {t(locale, "auth.profile.deleteP2")} <br />
              {t(locale, "auth.profile.deleteP3")}
            </p>

            <form action={action}>
              <input
                type="text"
                value={confirmation}
                onChange={(e) => setConfirmation(e.target.value)}
                placeholder={t(locale, "auth.profile.confirmText")}
                className="w-full border border-gray-300 bg-primary-foreground rounded-md px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              />

              {error && <ErrorMessage error={error} />}

              <div className="flex justify-end gap-2 mt-5">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100 transition cursor-pointer"
                >
                  {t(locale, "cancel")}
                </button>
                <button
                  type="submit"
                  disabled={
                    confirmation !== t(locale, "auth.profile.confirmText") ||
                    isPending
                  }
                  className={`px-4 py-2 rounded-md text-white font-medium transition ${
                    confirmation !== t(locale, "auth.profile.confirmText") ||
                    isPending
                      ? "bg-red-400 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700 cursor-pointer"
                  }`}
                >
                  {isPending
                    ? t(locale, "auth.profile.deleting")
                    : t(locale, "auth.profile.confirmDelete")}
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
