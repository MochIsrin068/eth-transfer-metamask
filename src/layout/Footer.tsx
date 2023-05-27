import BottomWave from "../assets/bottom-wave.svg";

export default function Footer() {
  return (
    <section>
      <img
        src={BottomWave}
        alt="wave-bottom"
        className="absolute bottom-12 z-0 opacity-10"
      />
      <div className="bg-white w-full py-4 px-14 flex items-center justify-center z-10 relative">
        <p className="font-bold">
          &copy; 2023 -{" "}
          <a
            className="text-purple-600 hover:text-purple-400 cursor-pointer"
            target="_blank"
            href="https://github.com/MochIsrin068"
          >
            Rindev
          </a>
        </p>
      </div>
    </section>
  );
}
