import * as React from "react";

import { cn } from "../../lib/utils";

const Table = React.forwardRef(({ className, ...props }, ref) => (
  <div className="w-full overflow-auto">
    <table ref={ref} className={cn("w-full caption-bottom text-sm", className)} {...props} />
  </div>
));
Table.displayName = "Table";

const TableHeader = ({ className, ...props }) => (
  <thead className={cn("[&_tr]:border-b", className)} {...props} />
);

const TableBody = ({ className, ...props }) => (
  <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />
);

const TableFooter = ({ className, ...props }) => (
  <tfoot className={cn("bg-primary font-medium text-primary-foreground", className)} {...props} />
);

const TableRow = ({ className, ...props }) => (
  <tr className={cn("border-b transition-colors hover:bg-muted/50", className)} {...props} />
);

const TableHead = ({ className, ...props }) => (
  <th className={cn("h-12 px-4 text-left align-middle text-xs font-medium text-muted-foreground", className)} {...props} />
);

const TableCell = ({ className, ...props }) => (
  <td className={cn("p-4 align-middle", className)} {...props} />
);

const TableCaption = ({ className, ...props }) => (
  <caption className={cn("mt-4 text-sm text-muted-foreground", className)} {...props} />
);

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };
