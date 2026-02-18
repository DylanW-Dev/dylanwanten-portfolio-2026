import PortfolioProvider from "./context/PortfolioContext";
import PortfolioLayout from "./components/PortfolioLayout";
import "./index.css";

export default function App() {
  return (
    <PortfolioProvider>
      <PortfolioLayout />
    </PortfolioProvider>
  );
}
