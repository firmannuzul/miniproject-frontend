export const Footer = () => {
  return (
    <footer className="bg-card border-border relative mt-12 flex flex-col items-center justify-between border-t px-4 py-12 pt-8">
      {" "}
      <p className="text-muted-foreground text-md text-center justify-center flex">
        {" "}
        &copy; {new Date().getFullYear()} All rights reserved.
      </p>
      <a
        href="#hero"
        className="bg-primary/10 hover:bg-primary/20 text-primary rounded-full p-2 transition-colors"
      ></a>
    </footer>
  );
};