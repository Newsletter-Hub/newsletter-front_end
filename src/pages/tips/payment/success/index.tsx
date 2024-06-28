'use client';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const PaymentTipSuccess = () => {
  const router = useRouter();
  const { query } = router;

  useEffect(() => {
    if (query?.token) {
      // Page to redirect after success payment
      router.push(`/newsletters/categories/all?orderId=${query.token}`);
    }
  }, [query, router]);

  return (
    <div className="flex flex-col items-start xs:pt-6 xs:px-2.5 pt-20 gap-y-10 max-w-[1062px] mx-auto"></div>
  );
};

export default PaymentTipSuccess;
