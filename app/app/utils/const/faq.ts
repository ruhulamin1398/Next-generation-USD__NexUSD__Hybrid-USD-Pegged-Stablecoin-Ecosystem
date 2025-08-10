import { FAQItem } from "../../interfaces/faq";

export const faqData: FAQItem[] = [
  {
    question:
      "What is NexUSD and how does it maintain its peg to the US Dollar?",
    answer:
      "NexUSD is a next-generation USD-pegged stablecoin that maintains its $1.00 value through a Hybrid collateral system combining traditional reserves and decentralized mechanisms. Our smart contracts automatically adjust supply and demand while maintaining full transparency and regulatory compliance.",
  },
  {
    question: "How secure are my funds with NexUSD?",
    answer:
      "NexUSD employs multiple layers of security including smart contract audits by leading firms, multi-signature wallet protection, real-time monitoring systems, and insurance coverage. All reserves are held in regulated financial institutions and are subject to regular third-party audits.",
  },
  {
    question: "Which blockchains support NexUSD?",
    answer:
      "NexUSD is available on multiple blockchain networks including Ethereum, Polygon, Binance Smart Chain, Arbitrum, and Optimism. Our cross-chain bridge technology ensures seamless transfers between networks with minimal fees and maximum security.",
  },
  {
    question: "How can I mint or redeem NexUSD tokens?",
    answer:
      "You can mint NexUSD by depositing supported collateral (USDC, DAI, or fiat) through our platform. Redemption is available 24/7 with a 1:1 ratio. The process is automated through smart contracts and typically completes within minutes.",
  },
  {
    question: "What are the fees associated with NexUSD transactions?",
    answer:
      "Minting and redemption fees are kept minimal at 0.1%. Cross-chain transfers have variable fees based on network congestion. There are no holding fees, and all fee structures are transparent and published on our platform.",
  },
  {
    question: "Is NexUSD regulated and compliant?",
    answer:
      "Yes, NexUSD operates under strict regulatory compliance frameworks. We maintain licenses in key jurisdictions, conduct regular audits, implement KYC/AML procedures, and work closely with regulatory bodies to ensure full legal compliance.",
  },
  {
    question: "How can developers integrate NexUSD into their applications?",
    answer:
      "We provide comprehensive SDKs, REST APIs, and smart contract interfaces for easy integration. Our developer portal includes detailed documentation, code samples, testnet access, and dedicated technical support to help you build with NexUSD.",
  },
  {
    question: "What happens during market volatility?",
    answer:
      "NexUSD is designed to maintain stability during market turbulence through our Hybrid collateral system and algorithmic stabilization mechanisms. Emergency protocols and circuit breakers ensure the peg is maintained even during extreme market conditions.",
  },
];
