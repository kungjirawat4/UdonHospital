import Balance from 'react-wrap-balancer';

import { cn } from '@/libs/utils';

function PageHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <section
      className={cn(
        'flex flex-col items-center gap-2 px-4 pt-8 md:pt-12',
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
}

function PageHeaderHeading({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    // eslint-disable-next-line jsx-a11y/heading-has-content
    <h1
      className={cn(
        'text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]',
        className,
      )}
      {...props}
    />
  );
}

function PageHeaderDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <div className="flex justify-center">
      <Balance
        className={cn('max-w-[750px] text-muted-foreground', className)}
        {...props}
      />
    </div>
  );
}

export { PageHeader, PageHeaderDescription, PageHeaderHeading };
