import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TypingAnimationService {
  
  typeText(element: HTMLElement, text: string, speed: number = 50): Promise<void> {
    return new Promise((resolve) => {
      element.textContent = '';
      let i = 0;
      
      const timer = setInterval(() => {
        if (i < text.length) {
          element.textContent += text.charAt(i);
          i++;
        } else {
          clearInterval(timer);
          resolve();
        }
      }, speed);
    });
  }

  typeTextWithCursor(element: HTMLElement, text: string, speed: number = 50): Promise<void> {
    return new Promise((resolve) => {
      element.innerHTML = '<span class="typing-cursor">|</span>';
      let i = 0;
      
      const timer = setInterval(() => {
        if (i < text.length) {
          element.innerHTML = text.substring(0, i + 1) + '<span class="typing-cursor">|</span>';
          i++;
        } else {
          clearInterval(timer);
          element.innerHTML = text;
          resolve();
        }
      }, speed);
    });
  }

  fadeInText(element: HTMLElement, text: string, duration: number = 1000): Promise<void> {
    return new Promise((resolve) => {
      element.textContent = text;
      element.style.opacity = '0';
      element.style.transform = 'translateY(20px)';
      
      let start: number;
      const animate = (timestamp: number) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        
        element.style.opacity = progress.toString();
        element.style.transform = `translateY(${20 * (1 - progress)}px)`;
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };
      
      requestAnimationFrame(animate);
    });
  }

  staggerText(elements: HTMLElement[], delay: number = 100): Promise<void> {
    return new Promise((resolve) => {
      let completed = 0;
      
      elements.forEach((element, index) => {
        setTimeout(() => {
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
          
          completed++;
          if (completed === elements.length) {
            resolve();
          }
        }, index * delay);
      });
    });
  }
}
