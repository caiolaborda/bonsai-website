import portfolioData from '../data/portfolio.json';

export default function usePortfolio() {
  // Since we now use build-time JSON syncing, data is available synchronously.
  return { 
    items: portfolioData, 
    loading: false, 
    error: null 
  };
}
