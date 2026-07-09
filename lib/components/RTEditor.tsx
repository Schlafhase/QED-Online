"use client";

import { Skeleton } from "@mantine/core";
import dynamic from "next/dynamic";

const RTEditor = dynamic(() => import("./_RTEditor"), {
  ssr: false,
  loading: () => <Skeleton mih={300} />,
});

export default RTEditor;
