package ivan.personal.tours.service.framework;

import ivan.personal.tours.environment.port.IMailSender;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MailService {
    private final IMailSender mailSender;

    public void sendSimpleMail(String to, String subject, String text) {
        mailSender.sendSimpleMail(to, subject, text);
    }
}
