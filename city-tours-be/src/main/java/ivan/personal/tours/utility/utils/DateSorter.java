package ivan.personal.tours.utility.utils;

import ivan.personal.tours.model.News;

import java.util.Comparator;

public class DateSorter implements Comparator<News> {

    @Override
    public int compare(News o1, News o2) {
        return o2.getPublicationDate().compareTo(o1.getPublicationDate());
    }
}
