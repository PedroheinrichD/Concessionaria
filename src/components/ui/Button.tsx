import Link from "next/link";
import { ReactNode } from "react";
import styles from "./Button.module.css";

interface ButtonProps {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
}

export default function Button({ href, children, variant = "primary" }: ButtonProps) {
  return (
    <Link href={href} className={`${styles.button} ${styles[variant]}`}>
      {children}
    </Link>
  );
}
