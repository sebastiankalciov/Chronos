export function LangGraphLogoSVG({
  className,
  width,
  height,
}: {
  width?: number;
  height?: number;
  className?: string;
}) {
  return (
      <svg width={width} height={height} className={className} fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#5878f9"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M2 12C2 8.22876 2 6.34315 3.17157 5.17157C4.34315 4 6.22876 4 10 4H14C17.7712 4 19.6569 4 20.8284 5.17157C22 6.34315 22 8.22876 22 12V14C22 17.7712 22 19.6569 20.8284 20.8284C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.8284C2 19.6569 2 17.7712 2 14V12Z" stroke="#5d7eea" strokeWidth="1.5"></path> <path d="M18 16L16 16M16 16L14 16M16 16L16 14M16 16L16 18" stroke="#5d7eea" strokeWidth="1.5" strokeLinecap="round"></path> <path opacity="0.5" d="M7 4V2.5" stroke="#5d7eea" strokeWidth="1.5" strokeLinecap="round"></path> <path opacity="0.5" d="M17 4V2.5" stroke="#5d7eea" strokeWidth="1.5" strokeLinecap="round"></path> <path opacity="0.5" d="M2 9H22" stroke="#5d7eea" strokeWidth="1.5" strokeLinecap="round"></path> </g></svg>
  );
}
