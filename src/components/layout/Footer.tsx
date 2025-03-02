
export const Footer = () => {
  return (
    <footer className="bg-secondary/50 py-6 border-t mt-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Student Document Generator</p>
          <p className="mt-1">Designed for educational institutions to manage student documentation efficiently.</p>
        </div>
      </div>
    </footer>
  );
};
