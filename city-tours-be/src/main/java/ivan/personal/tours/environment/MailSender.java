package ivan.personal.tours.environment;

import ivan.personal.tours.environment.port.IMailSender;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

@Component
@Profile("!dev")
public class MailSender implements IMailSender {

    private final JavaMailSender sender;
    @Value("${app.mail.sender}")
    private String from;

    public MailSender(JavaMailSender sender) {
        this.sender = sender;
    }

    @Override
    public void sendSimpleMail(String to, String subject, String text) {
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setFrom(from);
        mailMessage.setTo(to);
        mailMessage.setSubject(subject);
        mailMessage.setText(text);

        sender.send(mailMessage);
    }
}
