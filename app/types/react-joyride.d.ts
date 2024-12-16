declare module 'react-joyride' {
  import { ComponentType } from 'react';
  
  export interface Step {
    target: string;
    content: string | ComponentType;
    placement?: 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end' | 'right' | 'right-start' | 'right-end' | 'center';
    disableBeacon?: boolean;
    title?: string;
  }

  export interface JoyrideProps {
    steps: Step[];
    run: boolean;
    continuous?: boolean;
    showProgress?: boolean;
    showSkipButton?: boolean;
    callback?: (data: Record<string, unknown>) => void;
    styles?: {
      options?: {
        primaryColor?: string;
        backgroundColor?: string;
        textColor?: string;
        arrowColor?: string;
      }
    }
  }

  const Joyride: ComponentType<JoyrideProps>;
  export default Joyride;
} 