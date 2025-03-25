
import {Timeline,TimelineItem,TimelineTitle,TimelineDescription,TimelineTime, TimelineHeader,} from '@/components/timeLine/timeline';
import parse, { domToReact } from 'html-react-parser'; // Importamos la librería
import { timeLineInterface } from '@/interfaces/timeLineInterface';

interface TimelineLayoutProps {
    timelineData: timeLineInterface[];
  }

  export const TimelineLayout = ({ timelineData }: TimelineLayoutProps) => {
    //console.log("Timeline Data:", timelineData); // Verifica que los datos se están pasando correctamente
  
    return (
      <Timeline className="mt-8">
        {timelineData?.map((item) => {
          // Formatear la fecha al formato "Marzo 2025"
          const formattedTime = new Date(item.time).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          });
  
          const hasHTML = /<\/?[a-z][\s\S]*>/i.test(item.description? item.description:"");
          
          return (
            <TimelineItem key={item.id} className='m-5'>
              <TimelineHeader>
                <TimelineTime>{formattedTime}</TimelineTime> {/* 📅 Aquí mostramos la fecha formateada */}
                <TimelineTitle>{item.title}</TimelineTitle>
              </TimelineHeader>
              {item.description && (
                <TimelineDescription>
                  {hasHTML ? (
                  parse(item.description, {
                    replace: (domNode) => {
                      if (domNode.type === 'tag') {
                        if (domNode.name === 'a' && domNode.attribs) {
                          return (
                            <a href={domNode.attribs.href} style={{ textDecoration: 'underline', color: 'blue' }}>
                              {domToReact(domNode.children as unknown as any[])}
                            </a>
                          );
                        }
                      }
                    }
                  })
                ) : (
                  item.description
                )}
                </TimelineDescription>
              )}
            </TimelineItem>
          );
        })}
      </Timeline>
    );
  };
  
  