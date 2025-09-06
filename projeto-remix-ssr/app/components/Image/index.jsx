export const Image = ({
  src,
  alt,
  width,
  height,
  style,
  quality,
  className,
  ...props
}) => {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      style={style}
      className={className}
      loading="lazy" // Lazy loading nativo
      {...props}
    />
  );
};
