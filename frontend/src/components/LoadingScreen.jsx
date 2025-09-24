const LoadingScreen = ({ message = "Memuat..." }) => (
  <div className="flex min-h-[240px] w-full items-center justify-center">
    <div className="flex flex-col items-center gap-2 text-muted-foreground">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  </div>
);

export default LoadingScreen;
