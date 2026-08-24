import {
  MessageCircleQuestionMarkIcon,
  MessageCircleReplyIcon,
} from "lucide-react";
import FormContact from "@/components/footer/form/form-contact";

const ExpandableContent = () => {
  return (
    <div className="relative z-10 flex flex-col lg:flex-row h-full w-full max-w-275 mx-auto items-center p-6 sm:p-10 lg:p-16 gap-8 lg:gap-16">
      <div className="flex-1 flex flex-col justify-center space-y-3 w-full">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-primary-foreground leading-none tracking-[-0.03em]">
          Contact me
        </h2>

        <div className="space-y-4 sm:space-y-6 pt-4">
          <div className="flex gap-3 sm:gap-4">
            <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary-foreground/10 flex items-center justify-center">
              <MessageCircleQuestionMarkIcon
                size={24}
                className="text-primary-foreground"
              />
            </div>
            <div>
              <p className="text-sm sm:text-base text-primary-foreground leading-[150%]">
                Got a question, feedback on a post, or just want to say hi? Feel
                free to reach out.
              </p>
            </div>
          </div>

          <div className="flex gap-3 sm:gap-4">
            <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary-foreground/10 flex items-center justify-center">
              <MessageCircleReplyIcon
                size={24}
                className="text-primary-foreground"
              />
            </div>
            <div>
              <p className="text-sm sm:text-base text-primary-foreground leading-[150%]">
                I usually reply within a couple of days. Looking forward to
                hearing from you.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 sm:pt-8 mt-6 sm:mt-8 border-t border-primary-foreground/20">
          <p className="text-lg sm:text-xl lg:text-2xl text-primary-foreground leading-[150%] mb-4">
            Whether it’s about code, side projects or just a quick hello — I’m
            always happy to chat.
          </p>
          <div className="flex items-center gap-3 sm:gap-4">
            <div>
              <p className="text-base sm:text-lg lg:text-xl text-primary-foreground">
                David
              </p>
              <p className="text-sm text-primary-foreground/70">
                Software Engineer
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full">
        <FormContact />
      </div>
    </div>
  );
};

export default ExpandableContent;
