export const Landing = () => {
  return (
    <div className="flex flex-col justify-center mt-32 mb-6 w-full max-w-[800px] mx-auto px-4">
      <h1 className="text-center scroll-m-20 text-4xl font-extrabold tracking-tight whitespace-pre-wrap">
        Trade&nbsp;Smarter, &nbsp;Earn&nbsp;More
      </h1>
      <p className="leading-7 [&:not(:first-child)]:mt-6 ml-6">
        Trade seamlessly using Uniswap V3 for precise limit orders, no slippage,
        and zero extra fees.
      </p>
      <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
        <li>
          <span className="font-bold">Powered by Uniswap V3:</span> Fully
          integrated with Uniswap V3,{" "}
          <span className="font-medium underline">without</span> extra
          contracts.
        </li>
        <li>
          <span className="font-bold">No Slippage:</span> Execute trades at your
          desired price, making trading{" "}
          <span className="font-medium underline">predictable</span> and
          efficient.
        </li>
        <li>
          <span className="font-bold">Zero Fees:</span> No additional fees for
          limit orders, <span className="font-medium underline">earn fees</span>{" "}
          by providing liquidity.
        </li>
        <li>
          <span className="font-bold">Earn While You Trade:</span> Make your
          assets <span className="font-medium underline">work for you</span>,
          even when they're waiting to be traded.
        </li>
      </ul>
    </div>
  );
};
