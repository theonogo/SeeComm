// import { useEffect, useRef, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function VideoClip({vidURL, clip_start, clip_end} : {vidURL: string, clip_start: number, clip_end: number}) {

//// Google drive doesnt actually allow to set an end to a clip like youtube does.
//// Below is potentially some code to force a re-render after x seconds, which would be a way to end clip.
//// But I'm not doing it because its too hacky.
//   const iframeRef = useRef(null);
//   const [key, setKey] = useState(0);
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setKey(prev => prev + 1); // Refresh iframe
//     }, );

//     return () => clearTimeout(timer);
//   }, []);

  const iframeSrc = `${vidURL.split('/view?')[0]}/preview?t=${clip_start}s`;

  return (
    <iframe
    //   key={key}
    //   ref={iframeRef}
      src={iframeSrc}
      className="w-full aspect-video mt-6 mb-2"
    ></iframe>
  );
}