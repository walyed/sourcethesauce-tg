import { GetServerSideProps } from "next";

// Redirect root to Telegram mini app
export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: '/tg',
      permanent: false,
    },
  }
}

export default function Home() {
  return null
}
