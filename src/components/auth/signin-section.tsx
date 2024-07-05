'use client'

import { Motion } from '@/components/animate/motion'
import { TextMotion } from '@/components/animate/text-motion'
import { Button } from '@/components/ui/button'
import { client } from '@/db/client'
import { fromBottom, fromLeft, fromTop } from '@/lib/motion/variants'
import { usePbAuth } from '@/providers/auth-provider'
import { GitHubLogoIcon } from '@radix-ui/react-icons'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import type { AuthProviderInfo, RecordModel as PbRecord } from "pocketbase";

export const SigninSection = () => {

  const { user, googleSignIn, githubSignIn, setUserData } = usePbAuth();

  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push("/projects");
    }
  })

  const storeUserAndRedirect = (user: PbRecord) => {
    setUserData(user);
    router.replace("/projects");
  };

  useEffect(() => {
    const localAuthProvider: AuthProviderInfo = JSON.parse(
      localStorage.getItem("provider") as string
    );
    const params = new URL(location.href).searchParams;
    const redirectUrl = `${location.origin}/signin`;
    const code = params.get("code");

    // cancel signin logic if not a redirect
    if (
      !localAuthProvider ||
      !code ||
      localAuthProvider.state !== params.get("state")
    )
      return;

    client.collection("users").authWithOAuth2Code(
      localAuthProvider.name,
      code,
      localAuthProvider.codeVerifier,
      redirectUrl,

    )
      .then(async (response) => {
        const user = await client.collection("users").getOne(response.record.id);
        console.log(user);
        console.log(response.meta);
        console.log(response.record.id);

        // skip profile updation if user already exists or user data from OAuth providers haven't changed
        if (
          user.name &&
          user.avatarUrl &&
          user.name === response.meta?.name &&
          user.avatarUrl === response.meta?.avatarUrl
        ) {
          storeUserAndRedirect(user);
        } else
          client.collection("users")
            .update(response.record.id, {
              name: response.meta?.name,
              avatarUrl: response.meta?.avatarUrl,
              emailVisibility: true,
            })
            .then((res) => {
              storeUserAndRedirect(res);
            })
            .catch((err) => {
              console.error(err);
            });
      })
      .catch((err) => {
        console.error(err);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container relative pb-10">
      <section className="mx-auto flex max-w-[980px] flex-col items-center gap-2 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-6">
        <h1 className="text-center text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]">
          <TextMotion text='Elevate Your Team’s Productivity' />
        </h1>
        <span className="max-w-[750px] text-center text-lg font-light text-foreground">
          <TextMotion text='Join our community and revolutionize the way your team manages projects. Sign up today to get started!' />
        </span>
        <div className="flex w-full items-center justify-center space-x-4 py-4 md:pb-6">
          <Motion variants={fromTop}>
            <Button variant="default" onClick={googleSignIn}>
              Get Started with Google
            </Button>
          </Motion>
        </div>
      </section>
    </div>
  )
}
