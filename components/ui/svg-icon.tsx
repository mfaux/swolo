import Image from 'next/image';

interface SVGIconProps {
  src: string;
  alt?: string;
  size?: number;
  className?: string;
}

export const SVGIcon = ({
  src,
  alt = '',
  size = 24,
  className = '',
}: SVGIconProps) => {
  return (
    <Image
      src={src}
      width={size}
      height={size}
      alt={alt}
      className={className}
    />
  );
};
