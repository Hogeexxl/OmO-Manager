/* [INPUT] None */
/* [OUTPUT] Application Footer */
/* [POS] src/layouts/AppFooter.jsx */
import React from 'react';

const AppFooter = () => {
  return (
    <footer className="py-6 md:px-8 md:py-0 border-t">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built by <a href="#" className="font-medium underline underline-offset-4">Antigravity</a>. 
          The source code is available on <a href="#" className="font-medium underline underline-offset-4">GitHub</a>.
        </p>
      </div>
    </footer>
  );
};

export default AppFooter;
