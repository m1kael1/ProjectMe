"use client";

import { Variants, motion, useInView } from "framer-motion";
import { FC, useRef } from "react";
import { textReveal } from "@/lib/motion/variants";
import { cn } from "@/lib/utils";

interface MotionProps {
  variants?: Variants;
  className?: string;
  text: string;
}

export const TextMotion: FC<MotionProps> = ({ variants, className, text }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  return (
    <motion.span
      ref={ref}
      animate={isInView ? "animate" : "initial"}
      initial={"initial"}
    >
      {text.split(" ").map((word, index) => (
        <motion.p key={index} className="inline-block">
          {word.split("").map((char, index) => (
            <motion.span
              key={index}
              className={cn("inline-block", className)}
              variants={variants ? variants : textReveal}
              custom={index}
            >
              {char}
            </motion.span>
          ))}
          <span>&nbsp;</span>
        </motion.p>
      ))}
    </motion.span>
  );
};