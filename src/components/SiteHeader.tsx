"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import { useAccessibilitySettings } from "@/hooks/useAccessibilitySettings";
import { useWishlist } from "@/hooks/useWishlist";

const navigation = [
  { href: "/products", label: "Explore" },
  { href: "/configure", label: "Configure" },
  { href: "/about", label: "Our design" },
  { href: "/help", label: "Help" },
  { href: "/accessibility", label: "Accessibility" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { itemCount } = useCart();
  const { productIds } = useWishlist();
  const { settings } = useAccessibilitySettings();
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingHref = useRef<string | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const openMenu = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    pendingHref.current = null;
    setMenuVisible(true);
    setMenuOpen(true);
  }, []);

  const closeMenu = useCallback((href?: string) => {
    setMenuOpen(false);
    pendingHref.current = href ?? null;
    if (closeTimer.current) clearTimeout(closeTimer.current);
    const systemPrefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (settings.reduceMotion || systemPrefersReducedMotion) {
      setMenuVisible(false);
      if (href) router.push(href);
      pendingHref.current = null;
      return;
    }
    closeTimer.current = setTimeout(() => {
      setMenuVisible(false);
      const target = pendingHref.current;
      pendingHref.current = null;
      if (target) router.push(target);
    }, 760);
  }, [router, settings.reduceMotion]);

  const finishClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
    setMenuVisible(false);
    const target = pendingHref.current;
    pendingHref.current = null;
    if (target) router.push(target);
  }, [router]);

  useEffect(() => {
    if (!menuOpen) return;

    const menuButton = menuButtonRef.current;
    mobileMenuRef.current
      ?.querySelector<HTMLAnchorElement>("a")
      ?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeMenu();
        return;
      }

      if (event.key !== "Tab") return;
      const links = mobileMenuRef.current?.querySelectorAll<HTMLAnchorElement>(
        "a[href]"
      );
      if (!links?.length) return;
      const firstLink = links[0];
      const lastLink = links[links.length - 1];
      if (event.shiftKey && document.activeElement === firstLink) {
        event.preventDefault();
        lastLink.focus();
      } else if (!event.shiftKey && document.activeElement === lastLink) {
        event.preventDefault();
        firstLink.focus();
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      menuButton?.focus();
    };
  }, [closeMenu, menuOpen]);

  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    },
    []
  );

  return (
    <header className="site-header sticky top-0 z-50 mx-auto flex max-w-7xl items-center justify-between gap-3 border-b border-white/10 py-3 sm:gap-4 sm:py-4">
      <Link
        href="/"
        className="site-brand shrink-0 text-lg font-bold tracking-[0.18em] sm:text-xl"
        aria-label="Orbit home"
      >
        ORBIT<span className="text-blue-400">.</span>
      </Link>

      <nav
        aria-label="Main navigation"
        className="site-desktop-nav hidden items-center gap-1 rounded-full border border-white/[0.07] bg-black/20 p-1 text-sm text-gray-400 xl:flex"
      >
        {navigation.map((item, index) => {
          const isActive =
            item.href === "/products"
              ? pathname === "/products" || pathname.startsWith("/products/")
              : pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`site-nav-link ${isActive ? "is-active" : ""}`}
              style={{ "--nav-index": index } as CSSProperties}
            >
              <span className="site-nav-link__index">
                {String(index + 1).padStart(2, "0")}
              </span>
              {item.label}
              <span className="site-nav-link__spark" aria-hidden="true" />
            </Link>
          );
        })}
      </nav>

      <div className="relative z-61 flex shrink-0 items-center gap-1.5 text-xs sm:gap-2 sm:text-sm">
        <Link
          href="/wishlist"
          aria-label={`View saved products, ${productIds.length} items`}
          className="site-header-action rounded-full border border-white/10 px-2.5 py-2 transition hover:bg-white/10 sm:px-3"
        >
          <span className="hidden sm:inline">Saved</span>
          <span className="sm:hidden" aria-hidden="true">♡</span>
          <span className="ml-1 font-semibold">{productIds.length}</span>
        </Link>
        <Link
          href="/cart"
          aria-label={`View cart, ${itemCount} items`}
          className="site-header-action rounded-full border border-white/10 px-2.5 py-2 transition hover:bg-white/10 sm:px-3"
        >
          <span className="hidden sm:inline">Cart</span>
          <span className="sm:hidden" aria-hidden="true">Bag</span>
          <span className="ml-1 font-semibold">{itemCount}</span>
        </Link>
        <button
          ref={menuButtonRef}
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-curtain-menu"
          onClick={() => (menuOpen ? closeMenu() : openMenu())}
          className={`site-menu-toggle flex min-h-10 items-center gap-2 rounded-full border px-3 text-xs font-medium sm:text-sm xl:hidden ${
            menuOpen
              ? "border-blue-300/50 bg-blue-300/10 text-white"
              : "border-white/10 text-gray-200 hover:border-white/30 hover:bg-white/6"
          }`}
        >
          <span className={`site-menu-icon ${menuOpen ? "is-open" : ""}`}>
            <span />
            <span />
          </span>
          <span>{menuOpen ? "Close" : "Menu"}</span>
        </button>
      </div>

      {menuVisible && (
        <div
          ref={mobileMenuRef}
          id="mobile-curtain-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Orbit mobile menu"
          className={`mobile-curtain-menu ${menuOpen ? "is-open" : "is-closing"}`}
          aria-hidden={!menuOpen}
          inert={!menuOpen}
          onAnimationEnd={(event) => {
            if (
              !menuOpen &&
              event.target === event.currentTarget &&
              event.animationName === "curtain-menu-fade-out"
            ) {
              finishClose();
            }
          }}
        >
          <div className="mobile-curtain-menu__stage" aria-hidden="true">
            <div className="mobile-curtain-menu__panel mobile-curtain-menu__panel--left" />
            <div className="mobile-curtain-menu__panel mobile-curtain-menu__panel--right" />
            <div className="mobile-curtain-menu__seam" />
          </div>
          <nav
            aria-label="Mobile navigation"
            className="mobile-curtain-menu__content"
          >
            <p className="mobile-curtain-menu__eyebrow">Explore Orbit</p>
            <ul>
              {navigation.map((item, index) => {
                const isActive =
                  item.href === "/products"
                    ? pathname === "/products" ||
                      pathname.startsWith("/products/")
                    : pathname === item.href;
                return (
                  <li
                    key={item.href}
                    className="mobile-curtain-menu__item"
                    style={{ "--menu-index": index } as CSSProperties}
                  >
                    <Link
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      tabIndex={menuOpen ? 0 : -1}
                      onClick={(event) => {
                        event.preventDefault();
                        closeMenu(item.href);
                      }}
                    >
                      <span className="mobile-curtain-menu__number">
                        0{index + 1}
                      </span>
                      <span>{item.label}</span>
                      <span className="mobile-curtain-menu__arrow" aria-hidden="true">
                        ↗
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <p className="mobile-curtain-menu__footer">
              Sound objects, explored in three dimensions.
            </p>
          </nav>
        </div>
      )}
    </header>
  );
}
