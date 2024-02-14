interface DividerProps {
  label: string;
}
export const Divider = (props: DividerProps) => {
  return (
    <div class="flex justify-center items-center gap-4">
      <div class="flex-1 border border-b-slate-300"></div>
      <div>{props.label}</div>
      <div class="flex-1 border border-b-slate-300"></div>
    </div>
  );
};
