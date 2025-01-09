import { cn } from "@/lib/utils";

type TypographyProps = {
  children: React.ReactNode;
  className?: string;
};

export function H1({ children, className }: TypographyProps) {
  return (
    <h1
      className={cn(
        "scroll-m-20 lg:text-5xl text-4xl font-extrabold tracking-tight",
        className
      )}
    >
      {children}
    </h1>
  );
}

export function H2({ children, className }: TypographyProps) {
  return (
    <h2
      className={cn(
        "scroll-m-20 first:mt-0 pb-2 text-3xl font-semibold tracking-tight border-b",
        className
      )}
    >
      {children}
    </h2>
  );
}

export function H3({ children, className }: TypographyProps) {
  return (
    <h3
      className={cn(
        "scroll-m-20 text-2xl font-semibold tracking-tight",
        className
      )}
    >
      {children}
    </h3>
  );
}

export function H4({ children, className }: TypographyProps) {
  return (
    <h4
      className={cn(
        "scroll-m-20 text-xl font-semibold tracking-tight",
        className
      )}
    >
      {children}
    </h4>
  );
}

export function H5({ children, className }: TypographyProps) {
  return (
    <h5
      className={cn(
        "scroll-m-20 text-lg font-semibold tracking-tight",
        className
      )}
    >
      {children}
    </h5>
  );
}

export function H6({ children, className }: TypographyProps) {
  return (
    <h6
      className={cn(
        "scroll-m-20 text-base font-semibold tracking-tight",
        className
      )}
    >
      {children}
    </h6>
  );
}

export function P({ children, className }: TypographyProps) {
  return (
    <p className={cn("leading-7 [&:not(:first-child)]:mt-4", className)}>
      {children}
    </p>
  );
}

export function Blockquote({ children, className }: TypographyProps) {
  return (
    <blockquote className={cn("pl-6 mt-6 italic border-l-2", className)}>
      {children}
    </blockquote>
  );
}

export function Lead({ children, className }: TypographyProps) {
  return (
    <p className={cn("text-muted-foreground text-xl", className)}>{children}</p>
  );
}

export function Large({ children, className }: TypographyProps) {
  return (
    <div className={cn("text-lg font-semibold", className)}>{children}</div>
  );
}

export function Small({ children, className }: TypographyProps) {
  return (
    <small className={cn("text-sm font-medium leading-none", className)}>
      {children}
    </small>
  );
}

export function Muted({ children, className }: TypographyProps) {
  return (
    <p className={cn("text-muted-foreground text-sm", className)}>{children}</p>
  );
}
