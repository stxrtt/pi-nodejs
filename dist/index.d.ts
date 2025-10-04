import { PaymentArgs, PaymentDTO } from "./types";
import { PiPaymentError } from "./PiPaymentError";
export default class PiNetwork {
    private api;
    private myKeypair;
    private currentPayment;
    constructor(apiKey: string, walletPrivateSeed: string);
    createPayment: (payment: PaymentArgs) => Promise<string>;
    submitPayment: (paymentId: string) => Promise<string>;
    completePayment: (paymentId: string, txid: string) => Promise<PaymentDTO>;
    getPayment: (paymentId: string) => Promise<PaymentDTO>;
    cancelPayment: (paymentId: string) => Promise<PaymentDTO>;
    getIncompleteServerPayments: () => Promise<Array<PaymentDTO>>;
    private validateApiKey;
    private validateSeedFormat;
    private validatePaymentData;
    private getHorizonClient;
    private buildA2UTransaction;
}
export { PiPaymentError };
