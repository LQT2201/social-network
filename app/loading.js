"use client";

import React from "react";
import Image from "next/image";
import styles from "@/app/_styles/loading.module.css";

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="flex flex-col items-center">
        <Image
          src="/images/catrun.gif"
          alt="Loading cat"
          width={128}
          height={128}
          className="w-32 h-32 object-contain"
        />
        <div className={styles.loadingTextContainer}>
          <span>L</span>
          <span>o</span>
          <span>a</span>
          <span>d</span>
          <span>i</span>
          <span>n</span>
          <span>g</span>
          <span className="ml-2">.</span>
          <span>.</span>
          <span>.</span>
        </div>
      </div>
    </div>
  );
};

export default Loading;
