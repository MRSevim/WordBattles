"use client";
import { useLocaleContext } from "@/features/language/helpers/LocaleContext";
import { t } from "@/features/language/lib/i18n";
import { usePathname, useRouter } from "next/navigation";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange?: "ChangeSearchParams";
}

const buttonClasses = "px-3 py-1 rounded-md text-sm font-medium transition";
const activeButtonClasses = "text-gray-700 hover:bg-gray-100 cursor-pointer";
const disabledButtonClasses = "text-gray-400 cursor-not-allowed";

export default function Pagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange = "ChangeSearchParams",
}: PaginationProps) {
  const pathname = usePathname();
  const { replace } = useRouter();
  const [locale] = useLocaleContext();

  const totalPages = Math.ceil(totalItems / pageSize);

  if (totalPages <= 1) return null; // no pagination needed

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handlePageChange = (page: number) => {
    if (onPageChange === "ChangeSearchParams") {
      replace(`${pathname}?page=${page.toString()}`);
    }
  };

  return (
    <div className="flex justify-center mt-8">
      <nav
        className="inline-flex items-center gap-2 bg-white shadow-sm rounded-lg px-3 py-2"
        aria-label={t(locale, "pagination.text")}
      >
        {/* First Page */}
        <button
          onClick={() => handlePageChange(1)}
          aria-label={t(locale, "pagination.goToFirst")}
          disabled={currentPage === 1}
          className={`${buttonClasses} ${
            currentPage === 1 ? disabledButtonClasses : activeButtonClasses
          }`}
        >
          <i className="bi bi-chevron-double-left"></i>
        </button>

        {/* Previous Button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label={t(locale, "pagination.goToPrev")}
          className={`${buttonClasses} ${
            currentPage === 1 ? disabledButtonClasses : activeButtonClasses
          }`}
        >
          <i className="bi bi-chevron-left"></i>
        </button>

        {/* Page Numbers */}
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`${buttonClasses} ${
              currentPage === page ? disabledButtonClasses : activeButtonClasses
            }`}
          >
            {page}
          </button>
        ))}

        {/* Next Button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          aria-label={t(locale, "pagination.goToNext")}
          disabled={currentPage === totalPages}
          className={`${buttonClasses} ${
            currentPage === totalPages
              ? disabledButtonClasses
              : activeButtonClasses
          }`}
        >
          <i className="bi bi-chevron-right"></i>
        </button>

        {/* Last Page */}
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          aria-label={t(locale, "pagination.goToLast")}
          className={`${buttonClasses} ${
            currentPage === totalPages
              ? disabledButtonClasses
              : activeButtonClasses
          }`}
        >
          <i className="bi bi-chevron-double-right"></i>
        </button>
      </nav>
    </div>
  );
}
