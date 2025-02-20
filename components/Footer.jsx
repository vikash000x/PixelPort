import Image from 'next/image';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

import images from '../assets';
// eslint-disable-next-line import/no-cycle
import { Button } from '.';

const FooterLinks = ({ heading, items }) => (
  <div className="flex-1 justify-start items-start">
    <h3 className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl mb-10">{heading}</h3>
    {items.map((item, index) => (
      <p key={index} className="font-poppins dark:text-white text-nft-black-1 font-normal text-base cursor-pointer dark:hover:text-nft-gray-1 hover:text-nft-black-1 my-3">{item}</p>
    ))}
  </div>
);

const Footer = () => (
  <footer className="flexCenter flex-col border-t dark:border-nft-black-1 border-nft-gray-1 sm:py-8 py-16">
    <div className="w-full minmd:w-4/5 flex flex-row md:flex-col sm:px-4 px-16">
      <div className="flexStart flex-1 flex-col">
        <div className="flexCenter cursor-pointer">
          <Image src={images.logo02} objectFit="contain" width={32} height={32} alt="logo" />
          <p className="dark:text-white text-nft-dark font-semibold text-lg ml-1">PixelPort</p>
        </div>
        <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-base mt-6">Get the latest updates</p>
        <div className="flexBetween md:w-full minlg:w-557 w-357 mt-6 dark:bg-nft-black-2 bg-white border dark:border-nft-black-2 border-nft-gray-2 rounded-md">
          <input
            type="email"
            placeholder="Your Email"
            className="h-full flex-1 w-full dark:bg-nft-black-2 bg-white px-4 rounded-md font-poppins dark:text-white text-nft-black-1 font-normal text-xs minlg:text-lg outline-none"
          />
          <div className="flex-initial">
            <Button btnName="Email me" classStyles="rounded-md" />
          </div>
        </div>
      </div>
      <div className="flex-1 flexBetweenStart flex-wrap ml-10 md:ml-0 md:mt-8">
        <FooterLinks heading="PixelPort" items={['Explore', 'How it Works', 'Contact Us']} />
        <FooterLinks heading="Support" items={['Help Center', 'Terms of service', 'Legal', 'Privacy policy']} />
      </div>
    </div>

    <div className="flexCenter w-full mt-5 border-t dark:border-nft-black-1 border-nft-gray-1 sm:px-4 px-16">
      <div className="bg-muted/50 py-12">
        <div className="container mx-auto px-4 text-center text-gray-200">
          <p className="text-white text-sm text-center">Come join us and hear for the unexpected miracle</p>
          <p className="text-lg font-semibold">Welcome to Vikash Codex Clan 💗</p>
          <div className="flex justify-center gap-6 mt-4">
            <a
              href="https://github.com/vikash000x"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-200 hover:text-gray-400 transition duration-300"
            >
              <FaGithub size={24} />
            </a>
            <a
              href="https://www.linkedin.com/in/vikash-sinha-215000259/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-200 hover:text-gray-400 transition duration-300"
            >
              <FaLinkedin size={24} />
            </a>
            <a
              href="https://x.com/vikash_sinha_"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-200 hover:text-gray-400 transition duration-300"
            >
              <FaTwitter size={24} />
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
