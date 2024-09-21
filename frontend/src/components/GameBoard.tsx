export const GameBoard = () => {
  return (
    <div className="w-2/3 flex flex-col items-center">
      <Cells />
    </div>
  );
};

const board = {
  width: 15,
  height: 15,
};

const Cells = () => {
  return (
    <>
      {[...Array(board.width)].map((e, i) => {
        return (
          <div key={i} className="flex">
            {[...Array(board.height)].map((e, i) => {
              return (
                <div
                  key={i}
                  className="-mt-1 -ml-1 w-10 h-10 bg-amber-300 border-4 border-black"
                ></div>
              );
            })}
          </div>
        );
      })}
    </>
  );
};
