export const ErrorMsg = ({ children }: { children: JSX.Element | string }) => {
  return <div class="bg-red-200 p-2 border border-red-500">{children}</div>;
};
