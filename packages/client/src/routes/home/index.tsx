import { Navigate, useSearchParams } from "react-router-dom";
import { useChainId } from "wagmi";
import { LimitOrderCreator } from "./limit-order-creator";
import { fixPair, INPUT_CURRENCY_KEY, OUTPUT_CURRENCY_KEY } from "./helper";
import { Connector } from "./connector";
import { Landing } from "./landing";

const Redirect: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  const chainId = useChainId();
  const [params] = useSearchParams();

  if (chainId !== 1) {
    return <div>ChainId '{chainId}' is not supported</div>; // todo
  }

  const inputCurrencyId = params.get(INPUT_CURRENCY_KEY) ?? undefined;
  const outputCurrencyId = params.get(OUTPUT_CURRENCY_KEY) ?? undefined;

  const { base, quote, redirect } = fixPair(
    chainId,
    inputCurrencyId,
    outputCurrencyId
  );

  if (redirect) {
    return (
      <Navigate
        to={`/${chainId}?${INPUT_CURRENCY_KEY}=${base}&${OUTPUT_CURRENCY_KEY}=${quote}`}
        replace
      />
    );
  }

  return <>{children}</>;
};

const Home = () => {
  return (
    <Redirect>
      <div className="flex justify-center mt-8">
        <Connector>
          <LimitOrderCreator />
        </Connector>
      </div>
      <Landing />
    </Redirect>
  );
};

export const Component = Home;
