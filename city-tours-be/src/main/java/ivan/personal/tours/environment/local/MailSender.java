package ivan.personal.tours.environment.local;

import ivan.personal.tours.environment.port.IMailSender;
import lombok.extern.java.Log;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Log
@Profile("dev")
public class MailSender implements IMailSender {
    @Override
    public void sendSimpleMail(String to, String subject, String text) {
        log.info("Fake Mail sent to: " + to + " with subject: " + subject + " and text: " + text);
    }
}
