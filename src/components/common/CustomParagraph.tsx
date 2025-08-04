import React from 'react';

interface CustomParagraphProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode;
}

export const CustomParagraph: React.FC<CustomParagraphProps> = ({ children, ...props }) => {
  const containsOnlyImage = React.Children.count(children) === 1 && 
    React.isValidElement(children) && 
    children.type === 'img';

  return (
    <p
      {...props}
      className={`${containsOnlyImage ? 'm-0' : ''} ${props.className ?? ''}`}
    >
      {children}
    </p>
  );
};

export default CustomParagraph;
