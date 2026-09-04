"use client";

import { useSyncExternalStore } from "react";
import Script from "next/script";
import { getConsent, subscribeConsent } from "@/lib/consent";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

function getStatisticsEnabled(): boolean {
  return getConsent()?.statistics === true;
}

function getServerEnabled(): boolean {
  return false;
}

/**
 * Loads the Google Analytics (GA4) tag only once the visitor has opted in to
 * the "Statistik" category. Nothing is requested from Google's servers
 * before that – no consent-mode "denied" ping, no script tag at all.
 */
export function AnalyticsLoader() {
  const enabled = useSyncExternalStore(subscribeConsent, getStatisticsEnabled, getServerEnabled);

  if (!enabled || !GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
