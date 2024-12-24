import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class PriceService {
    private readonly apiUrls = {
        ethereum: 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd',
        bitcoin: 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd',
        polygon: 'https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd',
    };

    async getChainPrice(chain: string): Promise<number> {
        const normalizedChain = chain.toLowerCase();
        const apiUrl = this.apiUrls[normalizedChain];

        if (!apiUrl) {
            throw new Error(`Unsupported chain: ${chain}`);
        }

        const response = await axios.get(apiUrl);

        if (normalizedChain === 'ethereum') {
            return response.data.ethereum.usd;
        } else if (normalizedChain === 'bitcoin') {
            return response.data.bitcoin.usd;
        } else if (normalizedChain === 'polygon') {
            return response.data['matic-network'].usd;
        }

        throw new Error(`Unexpected error for chain: ${chain}`);
    }

    async calculateSwapRate(ethAmount: number): Promise<{
        btcAmount: number;
        fee: { eth: number; usd: number };
    }> {
        const ethPrice = await this.getChainPrice('ethereum');
        const btcPrice = await this.getChainPrice('bitcoin');

        const ethInUsd = ethAmount * ethPrice;
        const btcAmount = ethInUsd / btcPrice;

        const feePercentage = 0.03; // 3% fee
        const feeInEth = ethAmount * feePercentage;
        const feeInUsd = feeInEth * ethPrice;

        return {
            btcAmount,
            fee: {
                eth: feeInEth,
                usd: feeInUsd,
            },
        };
    }
}
