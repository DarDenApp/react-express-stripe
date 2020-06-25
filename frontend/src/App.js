import React from 'react';
import scriptLoader from 'react-async-script-loader';
import axios from 'axios';

const CURRENCY = 'eur';
const PAYMENT_SERVER_URL = 'http://ec2-18-189-14-50.us-east-2.compute.amazonaws.com:8081'

const toCent = amount => amount * 100;

const StripeForm = ({ isScriptLoaded, isScriptLoadSucceed }) => {
  const [stripe, setStripe] = React.useState(null);

  React.useEffect(() => {
    if (isScriptLoaded && isScriptLoadSucceed) {
      setStripe(window.Stripe('pk_test_l53qXD5ejH6Aj6eR38R86ido00h6baFUeR'));
    }
  }, [isScriptLoaded, isScriptLoadSucceed]);

  const [amount, setAmount] = React.useState(0);

  const handleSubmit = async event => {
    event.preventDefault();

    const session = await axios.post(
      'http://ec2-18-189-14-50.us-east-2.compute.amazonaws.com',
      {
        customerEmail: 'matt@dardenapp.com',
        clientReferenceId:
          '0',
        lineItem: {
          name: 'My Name',
          description: 'My Description',
          amount: toCent(amount),
          currency: CURRENCY,
          quantity: 1,
        },
        successUrl: 'http://ec2-18-189-14-50.us-east-2.compute.amazonaws.com/success',
        cancelUrl: 'http://ec2-18-189-14-50.us-east-2.compute.amazonaws.com/cancel',
      }
    );

    const result = await stripe.redirectToCheckout({
      sessionId: session.data.id,
    });

    console.log(result.error.message);
  };

  if (!stripe) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="number"
        value={amount}
        onChange={event => setAmount(event.target.value)}
      />
      Euro
      <button type="submit">Buy</button>
    </form>
  );
};

export default scriptLoader('https://js.stripe.com/v3/')(StripeForm);
